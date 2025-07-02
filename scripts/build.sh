#!/bin/bash

# Build Script for Prueba Fullstack - Production Ready
# This script builds all applications and prepares them for production deployment

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
BUILD_DIR="${PROJECT_ROOT}/dist"
LOG_FILE="${PROJECT_ROOT}/build.log"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

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

# Check if we're in the right directory
check_project_root() {
    if [[ ! -f "$PROJECT_ROOT/package.json" ]] || [[ ! -f "$PROJECT_ROOT/nx.json" ]]; then
        error "Not in project root directory. Please run this script from the project root."
    fi
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."

    # Check Node.js version
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed"
    fi

    NODE_VERSION=$(node --version | cut -d'v' -f2)
    REQUIRED_VERSION="18.0.0"

    if ! npx semver -r ">=18.0.0" "$NODE_VERSION" &> /dev/null; then
        error "Node.js version $NODE_VERSION is not supported. Please use Node.js >= 18.0.0"
    fi

    # Check npm
    if ! command -v npm &> /dev/null; then
        error "npm is not installed"
    fi

    # Check Docker (for containerized builds)
    if ! command -v docker &> /dev/null; then
        warning "Docker is not installed. Skipping containerized build checks."
    fi

    success "Prerequisites check passed"
}

# Clean previous builds
clean_build() {
    log "Cleaning previous builds..."

    # Remove dist directory
    if [[ -d "$BUILD_DIR" ]]; then
        rm -rf "$BUILD_DIR"
        log "Removed previous dist directory"
    fi

    # Clean NX cache
    npx nx reset &> /dev/null || true

    # Clean node_modules cache
    npm cache clean --force &> /dev/null || true

    success "Build environment cleaned"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."

    # Install with clean install for reproducible builds
    npm ci --production=false

    # Verify critical dependencies
    if ! npm list @nx/workspace &> /dev/null; then
        error "Critical dependency @nx/workspace not found"
    fi

    success "Dependencies installed successfully"
}

# Build shared libraries first
build_shared_libs() {
    log "Building shared libraries..."

    # Build shared-types
    log "Building shared-types..."
    npx nx build shared-types

    # Build trpc-config
    log "Building trpc-config..."
    npx nx build trpc-config

    success "Shared libraries built successfully"
}

# Build API application
build_api() {
    log "Building API application..."

    # Set production environment
    export NODE_ENV=production

    # Build API
    npx nx build api --prod

    # Verify build output
    if [[ ! -f "$BUILD_DIR/api/main.js" ]]; then
        error "API build failed - main.js not found"
    fi

    success "API application built successfully"
}

# Build Web application
build_web() {
    log "Building Web application..."

    # Set production environment variables
    export NODE_ENV=production
    export NEXT_TELEMETRY_DISABLED=1

    # Build web application
    npx nx build web --prod

    # Verify build output
    if [[ ! -d "$BUILD_DIR/web/.next" ]]; then
        error "Web build failed - .next directory not found"
    fi

    success "Web application built successfully"
}

# Run tests
run_tests() {
    log "Running tests..."

    # Run all tests
    npx nx test shared-types
    npx nx test trpc-config

    # Skip API and Web tests if they don't exist yet
    if [[ -f "$PROJECT_ROOT/api/src/app/app.service.spec.ts" ]]; then
        npx nx test api
    else
        warning "Skipping API tests - no test files found"
    fi

    success "All tests passed"
}

# Validate build
validate_build() {
    log "Validating build..."

    # Check file sizes
    API_SIZE=$(du -sh "$BUILD_DIR/api" 2>/dev/null | cut -f1 || echo "N/A")
    WEB_SIZE=$(du -sh "$BUILD_DIR/web" 2>/dev/null | cut -f1 || echo "N/A")

    log "Build sizes - API: $API_SIZE, Web: $WEB_SIZE"

    # Check for common issues
    if grep -r "localhost" "$BUILD_DIR" &> /dev/null; then
        warning "Found localhost references in build - check configuration"
    fi

    # Verify TypeScript compilation
    if ! npx tsc --noEmit; then
        error "TypeScript compilation failed"
    fi

    success "Build validation completed"
}

# Generate build report
generate_report() {
    log "Generating build report..."

    REPORT_FILE="${PROJECT_ROOT}/build-report-${TIMESTAMP}.json"

    cat > "$REPORT_FILE" << EOF
{
  "timestamp": "$(date -Iseconds)",
  "version": "$(node -p "require('./package.json').version")",
  "node_version": "$(node --version)",
  "npm_version": "$(npm --version)",
  "commit_hash": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "branch": "$(git branch --show-current 2>/dev/null || echo 'unknown')",
  "build_sizes": {
    "api": "$(du -sh "$BUILD_DIR/api" 2>/dev/null | cut -f1 || echo 'N/A')",
    "web": "$(du -sh "$BUILD_DIR/web" 2>/dev/null | cut -f1 || echo 'N/A')",
    "total": "$(du -sh "$BUILD_DIR" 2>/dev/null | cut -f1 || echo 'N/A')"
  },
  "environment": {
    "NODE_ENV": "${NODE_ENV:-development}",
    "CI": "${CI:-false}"
  }
}
EOF

    log "Build report saved to: $REPORT_FILE"
}

# Create Docker images (optional)
build_docker_images() {
    if [[ "${BUILD_DOCKER:-false}" == "true" ]] && command -v docker &> /dev/null; then
        log "Building Docker images..."

        # Build API image
        docker build -f api/Dockerfile -t prueba-fullstack-api:latest .

        # Build Web image
        docker build -f web/Dockerfile -t prueba-fullstack-web:latest .

        success "Docker images built successfully"
    else
        log "Skipping Docker image build (BUILD_DOCKER not set or Docker not available)"
    fi
}

# Main execution
main() {
    log "Starting Prueba Fullstack production build..."
    log "Build started at: $(date)"
    log "Project root: $PROJECT_ROOT"

    # Create log file
    touch "$LOG_FILE"

    # Execute build steps
    check_project_root
    check_prerequisites
    clean_build
    install_dependencies
    run_tests
    build_shared_libs
    build_api
    build_web
    validate_build
    generate_report
    build_docker_images

    # Final summary
    success "Build completed successfully!"
    log "Build finished at: $(date)"
    log "Build artifacts available in: $BUILD_DIR"
    log "Build log saved to: $LOG_FILE"

    echo ""
    echo -e "${GREEN}🎉 Production build completed successfully!${NC}"
    echo -e "${BLUE}📁 Build output:${NC} $BUILD_DIR"
    echo -e "${BLUE}📋 Build log:${NC} $LOG_FILE"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Review the build report"
    echo "  2. Test the built applications"
    echo "  3. Deploy using: ./scripts/deploy.sh"
    echo ""
}

# Handle script interruption
cleanup() {
    echo ""
    warning "Build interrupted by user"
    exit 130
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --docker)
            export BUILD_DOCKER=true
            shift
            ;;
        --skip-tests)
            export SKIP_TESTS=true
            shift
            ;;
        --verbose)
            set -x
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --docker      Build Docker images"
            echo "  --skip-tests  Skip running tests"
            echo "  --verbose     Enable verbose output"
            echo "  --help, -h    Show this help message"
            echo ""
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            ;;
    esac
done

# Run main function
main "$@"
