import ReactModal from "react-modal";

if (typeof window !== "undefined") ReactModal.setAppElement("body");

export default function UpdateMealPlanModel() {
  return <ReactModal isOpen></ReactModal>;
}
