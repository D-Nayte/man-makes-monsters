import React, { Children, cloneelement, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function DragItem(props) {
  const { card, id, element, allCards, confirmed, maxHandSize, index, table } =
    props;
  const CustomComponent = element;
  const isBlackCard = card.pick;
  const isSkelettonCard = card.text === "";
  const [className, setClassName] = useState("lastWhiteCard");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    sortable,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      cardProps: { ...card },
      allCards: [...allCards],
      confirmed,
      maxHandSize,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    listStyle: "none",
    transition,

    opacity: isDragging ? 0.5 : 1,
    ...props.style,
  };

  return (
    <li
      key={card.text + index + id + table}
      ref={setNodeRef}
      style={isBlackCard || isSkelettonCard ? null : style}
      {...listeners}
      {...attributes}
      className={
        index === allCards.length - 1 && table === "player" ? className : null
      }
      onMouseLeave={
        index === allCards.length - 1 && table === "player"
          ? () => {
              setClassName("");
            }
          : null
      }>
      {element ? (
        <CustomComponent
          {...props}
          isBlackCard={isBlackCard ? true : false}
          allcards={allCards}
        />
      ) : (
        <h2> {id}</h2>
      )}
    </li>
  );
}
