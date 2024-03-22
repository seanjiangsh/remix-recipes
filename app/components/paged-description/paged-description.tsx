import Header from "../header/header";


type PagedDescriptionProps = {
  header: string;
  message: string;
};
export default function PagedDescription(props: PagedDescriptionProps) {
  const { header, message } = props;
  return (
    <div>
      <Header>{header}</Header>
      <p className="page-description-message">{message}</p>
    </div>
  );
}
