import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export const DeleteQuizzModal = ({ onClose, isOpen, onDelete }: Props) => {
  const { t } = useTranslation("resources");
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        onClose={onClose}
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            trick
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-darkgray shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg leading-6 text-nx-white font-bold"
              >
                {t("quizzes.modal.delete.title")}
              </Dialog.Title>
              <div className="my-6">
                <p className="text-sm text-nx-white">
                  {t("quizzes.modal.delete.description")}
                </p>
              </div>

              <div className="flex items-center">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200"
                  onClick={onClose}
                >
                  {t("quizzes.modal.delete.cancel")}
                </button>
                <div className="mx-2"></div>
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none"
                  onClick={onDelete}
                >
                  {t("quizzes.modal.delete.confirm")}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
