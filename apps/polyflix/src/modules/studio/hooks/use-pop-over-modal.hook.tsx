import React from "react";
import { SxProps, Theme, Popover as Modal, styled } from "@mui/material";
import { PropsWithChildren, useState } from "react";

const Popover = styled(Modal)(({ theme }) => ({
  "& .MuiList-root": {
    padding: "0",
  },
  "& .MuiButtonBase-root": {
    padding: "0.2rem 0.5rem",
    borderRadius: "8px",
  },
}));

type UsePopOverModalReturnProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>, data?: any) => void;
  outputData: any;
  handleClose: () => void;
  PopOver: ({
    children,
    sx,
  }: PropsWithChildren<MenuPopoverProps>) => JSX.Element;
};

type MenuPopoverProps = {
  sx?: SxProps<Theme>;
};

export const usePopOverModal = (): UsePopOverModalReturnProps => {
  const [isOpen, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [outputData, setOutputData] = useState(null);

  const onClick = (event: React.MouseEvent<HTMLButtonElement>, data: any) => {
    setAnchor(event.currentTarget);
    setOutputData(data);
    setOpen(!isOpen);
  };

  const handleClose = () => {
    setAnchor(null);
    setOpen(false);
  };

  const PopOver = ({ children, sx }: PropsWithChildren<MenuPopoverProps>) => (
    <Popover
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        sx: {
          overflow: "inherit",
          boxShadow: (theme) => theme.shadows[2],
          border: (theme) => `solid 1px ${theme.palette.background.paper}`,
          background: (theme) => theme.palette.background.paper,
          padding: "0.3rem",
          ...sx,
        },
      }}
      open={isOpen}
      onClose={handleClose}
      anchorEl={anchor}
    >
      {children}
    </Popover>
  );

  return { PopOver, onClick, handleClose, outputData };
};
