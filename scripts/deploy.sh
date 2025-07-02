#!/bin/bash

# Deploy Script for Prueba Fullstack - Production Deployment
# This script deploys the application stack to production environment

set -e  # Exit on any error
set -u  # Exit on undefined variables

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="${PROJECT_ROOT}/docker-compose.prod.yml"
ENV_FILE="${PROJECT_ROOT}/.env.production"
BACKUP_DIR="${PROJECT_ROOT}/backups"
LOG_FILE="${PROJECT_ROOT}/deploy.log"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Default values
ENVIRONMENT="production"
SKIP_BACKUP="false"
SKIP_HEALTH_CHECK="false"
ROLLBACK="false"
FORCE_RECREATE="false"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Check prerequisites
check_prerequisites() {
    log "Checking deployment prerequisites..."

    # Check if we're in the right directory
    if [[ ! -f "$PROJECT_ROOT/package.json" ]] || [[ ! -f "$PROJECT_ROOT/nx.json" ]]; then
        error "Not in project root directory"
    fi

    # Check Docker and Docker Compose
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose is not installed"
    fi

    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        error "Docker daemon is not running"
    fi

    # Check if compose file exists
    if [[ ! -f "$COMPOSE_FILE" ]]; then
        error "Docker Compose file not found: $COMPOSE_FILE"
    fi

    # Check environment file
    if [[ ! -f "$ENV_FILE" ]]; then
        warning "Production environment file not found: $ENV_FILE"
        log "Creating default environment file..."
        cp "${PROJECT_ROOT}/.env.production" "$ENV_FILE" || error "Failed to create environment file"
    fi

    success "Prerequisites check passed"
}

# Validate environment configuration
validate_environment() {
    log "Validating environment configuration..."

    # Source environment file
    if [[ -f "$ENV_FILE" ]]; then
        set -a
        source "$ENV_FILE"
        set +a
    fi

    # Check critical environment variables
    local required_vars=(
        "POSTGRES_PASSWORD"
        "REDIS_PASSWORD"
        "DATABASE_URL"
        "REDIS_URL"
    )

    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            error "Required environment variable $var is not set"
        fi
    done

    # Warn about default passwords
    if [[ "${POSTGRES_PASSWORD:-}" == "your_super_secure_postgres_password_here" ]]; then
        warning "Using default PostgreSQL password - please change for production"
    fi

    if [[ "${REDIS_PASSWORD:-}" == "your_super_secure_redis_password_here" ]]; then
        warning "Using default Redis password - please change for production"
    fi

    success "Environment validation completed"
}

# Create backup
create_backup() {
    if [[ "$SKIP_BACKUP" == "true" ]]; then
        log "Skipping backup creation"
        return 0
    fi

    log "Creating backup before deployment..."

    # Create backup directory
    mkdir -p "$BACKUP_DIR"

    # Backup database if container exists
    if docker ps -a --format '{{.Names}}' | grep -q "prueba-postgres"; then
        log "Backing up PostgreSQL database..."
        docker exec prueba-postgres pg_dump -U "${POSTGRES_USER:-postgres}" "${POSTGRES_DB:-prueba_fullstack}" > "${BACKUP_DIR}/postgres_backup_${TIMESTAMP}.sql" || warning "Database backup failed"
    fi

    # Backup Redis data if container exists
    if docker ps -a --format '{{.Names}}' | grep -q "prueba-redis"; then
        log "Backing up Redis data..."
        docker exec prueba-redis redis-cli --rdb "${BACKUP_DIR}/redis_backup_${TIMESTAMP}.rdb" || warning "Redis backup failed"
    fi

    # Backup current docker images
    log "Backing up current Docker images..."
    docker images --format "table {{.Repository}}:{{.Tag}}" | grep "prueba-fullstack" > "${BACKUP_DIR}/images_backup_${TIMESTAMP}.txt" || true

    success "Backup created successfully"
}

# Pre-deployment checks
pre_deployment_checks() {
    log "Running pre-deployment checks..."

    # Check disk space
    local available_space=$(df / | awk 'NR==2 {print $4}')
    local required_space=1048576  # 1GB in KB

    if [[ $available_space -lt $required_space ]]; then
        error "Insufficient disk space. Required: 1GB, Available: $(($available_space/1024))MB"
    fi

    # Check if ports are available
    local ports=("80" "443" "5432" "6379")
    for port in "${ports[@]}"; do
        if netstat -tulpn 2>/dev/null | grep ":$port " &> /dev/null; then
            warning "Port $port is already in use"
        fi
    done

    # Validate Docker Compose file
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" config &> /dev/null || error "Docker Compose configuration is invalid"

    success "Pre-deployment checks completed"
}

# Build Docker images
build_images() {
    log "Building Docker images..."

    # Set build context
    cd "$PROJECT_ROOT"

    # Build API image
    log "Building API image..."
    docker build -f api/Dockerfile -t prueba-fullstack-api:latest -t "prueba-fullstack-api:${TIMESTAMP}" .

    # Build Web image
    log "Building Web image..."
    docker build -f web/Dockerfile -t prueba-fullstack-web:latest -t "prueba-fullstack-web:${TIMESTAMP}" .

    # Verify images were built
    if ! docker images | grep -q "prueba-fullstack-api.*latest"; then
        error "API image build failed"
    fi

    if ! docker images | grep -q "prueba-fullstack-web.*latest"; then
        error "Web image build failed"
    fi

    success "Docker images built successfully"
}

# Stop existing services
stop_services() {
    log "Stopping existing services..."

    if docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps -q | grep -q .; then
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down --timeout 30
        log "Existing services stopped"
    else
        log "No existing services to stop"
    fi
}

# Deploy services
deploy_services() {
    log "Deploying services..."

    # Deploy with docker-compose
    local compose_args=""
    if [[ "$FORCE_RECREATE" == "true" ]]; then
        compose_args="--force-recreate"
    fi

    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d $compose_args

    success "Services deployed successfully"
}

# Health checks
health_checks() {
    if [[ "$SKIP_HEALTH_CHECK" == "true" ]]; then
        log "Skipping health checks"
        return 0
    fi

    log "Running health checks..."

    local max_attempts=30
    local attempt=1

    # Wait for services to be ready
    log "Waiting for services to be ready..."

    while [[ $attempt -le $max_attempts ]]; do
        local healthy_services=0
        local total_services=0

        # Check each service health
        for service in postgres redis api web nginx; do
            total_services=$((total_services + 1))

            if docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps "$service" | grep -q "healthy\|Up"; then
                healthy_services=$((healthy_services + 1))
            fi
        done

        if [[ $healthy_services -eq $total_services ]]; then
            success "All services are healthy"
            return 0
        fi

        log "Health check attempt $attempt/$max_attempts: $healthy_services/$total_services services healthy"
        sleep 10
        attempt=$((attempt + 1))
    done

    error "Health checks failed after $max_attempts attempts"
}

# Test endpoints
test_endpoints() {
    log "Testing application endpoints..."

    local base_url="http://localhost"
    local api_endpoint="${base_url}/api/health"
    local web_endpoint="${base_url}/health"

    # Test API endpoint
    if curl -f -s "$api_endpoint" &> /dev/null; then
        success "API endpoint is responding"
    else
        warning "API endpoint test failed"
    fi

    # Test Web endpoint
    if curl -f -s "$web_endpoint" &> /dev/null; then
        success "Web endpoint is responding"
    else
        warning "Web endpoint test failed"
    fi
}

# Rollback deployment
rollback_deployment() {
    log "Rolling back deployment..."

    # Stop current services
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down --timeout 30

    # Restore from backup if available
    local latest_backup=$(ls -t "${BACKUP_DIR}"/postgres_backup_*.sql 2>/dev/null | head -n1)
    if [[ -n "$latest_backup" ]]; then
        log "Restoring database from backup: $latest_backup"
        # Implementation would depend on specific backup/restore strategy
        warning "Database rollback not implemented - manual intervention required"
    fi

    error "Rollback completed - manual verification required"
}

# Cleanup old resources
cleanup() {
    log "Cleaning up old resources..."

    # Remove old Docker images (keep last 3 versions)
    docker images --format "table {{.Repository}}:{{.Tag}}" | grep "prueba-fullstack" | tail -n +4 | awk '{print $1":"$2}' | xargs -r docker rmi || true

    # Remove old backups (keep last 7 days)
    find "$BACKUP_DIR" -name "*backup_*" -type f -mtime +7 -delete 2>/dev/null || true

    # Remove unused Docker resources
    docker system prune -f --volumes || true

    success "Cleanup completed"
}

# Generate deployment report
generate_report() {
    log "Generating deployment report..."

    local report_file="${PROJECT_ROOT}/deployment-report-${TIMESTAMP}.json"

    cat > "$report_file" << EOF
{
  "timestamp": "$(date -Iseconds)",
  "environment": "$ENVIRONMENT",
  "version": "$(git describe --tags --always 2>/dev/null || echo 'unknown')",
  "commit_hash": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "branch": "$(git branch --show-current 2>/dev/null || echo 'unknown')",
  "services": {
    "postgres": "$(docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps postgres | grep -q Up && echo 'running' || echo 'stopped')",
    "redis": "$(docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps redis | grep -q Up && echo 'running' || echo 'stopped')",
    "api": "$(docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps api | grep -q Up && echo 'running' || echo 'stopped')",
    "web": "$(docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps web | grep -q Up && echo 'running' || echo 'stopped')",
    "nginx": "$(docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps nginx | grep -q Up && echo 'running' || echo 'stopped')"
  },
  "deployment_duration": "$(date -d @$(($(date +%s) - ${DEPLOY_START_TIME:-$(date +%s)})) -u +%H:%M:%S)"
}
EOF

    log "Deployment report saved to: $report_file"
}

# Main deployment function
main() {
    DEPLOY_START_TIME=$(date +%s)

    log "Starting Prueba Fullstack deployment to $ENVIRONMENT..."
    log "Deployment started at: $(date)"

    # Create log file
    touch "$LOG_FILE"

    # Handle rollback
    if [[ "$ROLLBACK" == "true" ]]; then
        rollback_deployment
        return $?
    fi

    # Execute deployment steps
    check_prerequisites
    validate_environment
    create_backup
    pre_deployment_checks
    build_images
    stop_services
    deploy_services
    health_checks
    test_endpoints
    cleanup
    generate_report

    # Final summary
    success "Deployment completed successfully!"
    log "Deployment finished at: $(date)"

    echo ""
    echo -e "${GREEN}🚀 Deployment completed successfully!${NC}"
    echo -e "${BLUE}🌐 Application URL:${NC} http://localhost"
    echo -e "${BLUE}📋 Deployment log:${NC} $LOG_FILE"
    echo ""
    echo -e "${YELLOW}Service Status:${NC}"
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
    echo ""
    echo -e "${YELLOW}Useful Commands:${NC}"
    echo "  Check logs:    docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE logs -f"
    echo "  Stop services: docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE down"
    echo "  Restart:       docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE restart"
    echo ""
}

# Handle script interruption
cleanup_on_exit() {
    echo ""
    warning "Deployment interrupted by user"
    log "Deployment interrupted - cleaning up..."

    # Stop any running services
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down --timeout 10 2>/dev/null || true

    exit 130
}

# Set trap for cleanup
trap cleanup_on_exit SIGINT SIGTERM

# Show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --env ENVIRONMENT     Target environment (default: production)"
    echo "  --skip-backup         Skip creating backup before deployment"
    echo "  --skip-health-check   Skip health checks after deployment"
    echo "  --rollback            Rollback to previous deployment"
    echo "  --force-recreate      Force recreate all containers"
    echo "  --verbose             Enable verbose output"
    echo "  --help, -h            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                           # Deploy to production"
    echo "  $0 --env staging             # Deploy to staging"
    echo "  $0 --rollback                # Rollback deployment"
    echo "  $0 --force-recreate          # Force recreate containers"
    echo ""
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --skip-backup)
            SKIP_BACKUP="true"
            shift
            ;;
        --skip-health-check)
            SKIP_HEALTH_CHECK="true"
            shift
            ;;
        --rollback)
            ROLLBACK="true"
            shift
            ;;
        --force-recreate)
            FORCE_RECREATE="true"
            shift
            ;;
        --verbose)
            set -x
            shift
            ;;
        --help|-h)
            show_usage
            exit 0
            ;;
        *)
            error "Unknown option: $1. Use --help for usage information."
            ;;
    esac
done

# Update environment file path based on environment
ENV_FILE="${PROJECT_ROOT}/.env.${ENVIRONMENT}"

# Run main function
main "$@"
