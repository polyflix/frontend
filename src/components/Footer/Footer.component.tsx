import Paragraph from "../Typography/Paragraph/Paragraph.component";
import Typography from "../Typography/Typography.component";

/**
 * WIP
 */
const Footer: React.FC = () => {
  return (
    <footer className="py-4 bg-nx-dark text-nx-white justify-center flex">
      <Paragraph>
        <Typography as="span" bold>
          Polyflix
        </Typography>{" "}
        &copy; 2021 - Designed & Developed by Thomas Gouveia{" "}
      </Paragraph>
    </footer>
  );
};

export default Footer;
