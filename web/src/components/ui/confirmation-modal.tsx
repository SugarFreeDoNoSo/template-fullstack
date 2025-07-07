"use client";
import { useState, useRef, ReactNode } from "react";
import { Button } from "./button";

interface ConfirmationModalProps {
  trigger: ReactNode;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmationModal({
  trigger,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmationModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();
  const handleConfirm = () => {
    onConfirm();
    close();
  };
  return (
    <>
      <span onClick={open}>{trigger}</span>
      <dialog ref={dialogRef} className="rounded-lg p-4 backdrop:bg-black/50">
        <div className="space-y-4">
          <p>Are you sure?</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={close} type="button">
              {cancelText}
            </Button>
            <Button onClick={handleConfirm} type="button">
              {confirmText}
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
