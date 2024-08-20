"use client";
import { useEffect, useState } from "react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setPdfUrl(
        "https://yhobzhlxgfeqchozplud.supabase.co/storage/v1/object/public/policy/privacyTerms.pdf?t=2024-08-20T20%3A14%3A54.272Z"
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div className="bg-white p-10 h-[80%] relative rounded-lg max-w-3xl w-full">
        <button
          onClick={onClose}
          className="absolute text-2xl text-afya-pink top-2 right-2"
        >
          X
        </button>
        <iframe
          src={pdfUrl}
          width="100%"
          height="1300px"
          className="border-0"
        />
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
