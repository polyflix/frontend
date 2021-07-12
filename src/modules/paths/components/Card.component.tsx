import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Notification } from "../../ui/components/Notification/Notification.component";
import { useTranslation } from "react-i18next";
import { Alert } from "../../ui/components/Alert/Alert.component";
import { Typography } from "../../ui/components/Typography/Typography.component";
import { Paragraph } from "../../ui/components/Typography/Paragraph/Paragraph.component";
import { TrashIcon } from "@heroicons/react/outline";
import { cn } from "../../common/utils";
import { Link } from "react-router-dom";
import {
  ConnectDropTarget,
  ConnectDragSource,
  DropTargetMonitor,
  DragSourceMonitor,
} from "react-dnd";
import {
  DragSource,
  DropTarget,
  DropTargetConnector,
  DragSourceConnector,
} from "react-dnd";
import { XYCoord } from "dnd-core";
import { Course } from "../../courses/models/course.model";

export const ItemTypes = {
  CARD: "card",
};

export interface CardDragObject {
  id: string;
  index: number;
}

export interface DragableItemProps {
  course: Course;
  index: number;
  onDelete?: (id: string) => void;
  moveCard: (dragIndex: number, hoverIndex: number) => void;

  isDragging: boolean;
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
}

interface DragableItemInstance {
  getNode(): HTMLDivElement | null;
}

const DragableItem = forwardRef<HTMLDivElement, DragableItemProps>(
  function Card(
    { course, isDragging, connectDragSource, onDelete, connectDropTarget },
    ref
  ) {
    const [open, setOpen] = useState<boolean>(false);
    const { t } = useTranslation();

    const elementRef = useRef(null);
    connectDragSource(elementRef);
    connectDropTarget(elementRef);

    const buildActionLink = (
      Icon: any,
      text: string,
      to: string,
      className: string = "",
      onClick?: () => void
    ) => {
      const content = (
        <Typography
          as="span"
          className={cn(
            "flex text-sm md:text-base hover:underline cursor-pointer hover:text-nx-red",
            className
          )}
        >
          <Icon className="w-4 md:w-5 mr-2 text-nx-red" /> {text}
        </Typography>
      );
      return onClick ? (
        <span onClick={onClick}>{content}</span>
      ) : (
        <Link to={to}>{content}</Link>
      );
    };

    const opacity = isDragging ? 0 : 1;
    useImperativeHandle<any, DragableItemInstance>(ref, () => ({
      getNode: () => elementRef.current,
    }));
    return (
      // <div ref={elementRef} style={{ ...style, opacity }}>
      //   {text}
      // </div>
      <div
        ref={elementRef}
        style={{ opacity }}
        className="grid grid-cols-12 gap-5 my-5 cursor-grab"
      >
        <Notification show={open}>
          <div className="flex flex-col md:grid md:items-center md:grid-cols-12">
            <div className="col-span-10">
              <Alert type="error">
                <Typography bold as="span" className="text-sm">
                  {t("shared.common.actions.delete")} {course.title} ?
                </Typography>
              </Alert>
            </div>
            <div className="flex items-center justify-end md:col-span-2">
              <div className="cursor-pointer" onClick={() => setOpen(false)}>
                <Typography
                  as="span"
                  className="text-sm transition-all hover:underline"
                >
                  {t("shared.common.actions.cancel")}
                </Typography>
              </div>
              <div className="mx-3"></div>
              {onDelete && (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setOpen(false);
                    onDelete(course.id);
                  }}
                >
                  <Typography
                    as="span"
                    className="text-nx-red text-sm transition-all hover:underline"
                    overrideDefaultClasses
                  >
                    {t("shared.common.actions.delete")}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </Notification>
        <div className="col-span-12 md:col-span-8 xl:col-span-9 flex flex-col justify-center">
          <Typography bold className="text-lg md:text-xl" as="h3">
            {course.title}
          </Typography>
          <Paragraph className="mb-4">{course.shortDescription}</Paragraph>
        </div>
        <div className="flex items-center">
          {buildActionLink(
            TrashIcon,
            t("shared.common.actions.delete"),
            "#",
            "ml-4",
            () => setOpen(true)
          )}
        </div>
      </div>
    );
  }
);

export default DropTarget(
  ItemTypes.CARD,
  {
    hover(
      props: DragableItemProps,
      monitor: DropTargetMonitor,
      component: DragableItemInstance
    ) {
      if (!component) {
        return null;
      }
      // node = HTML Div element from imperative API
      const node = component.getNode();
      if (!node) {
        return null;
      }

      const dragIndex = monitor.getItem<CardDragObject>().index;
      const hoverIndex = props.index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = node.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      props.moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem<CardDragObject>().index = hoverIndex;
    },
  },
  (connect: DropTargetConnector) => ({
    connectDropTarget: connect.dropTarget(),
  })
)(
  DragSource(
    ItemTypes.CARD,
    {
      beginDrag: (props: DragableItemProps) => ({
        id: props.course.id,
        index: props.index,
      }),
    },
    (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    })
  )(DragableItem)
);
