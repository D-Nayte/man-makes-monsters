import { arrayMove } from "@dnd-kit/sortable";
import { insertAtIndex, removeAtIndex } from "../utils/array";

export const handleDragStart = ({ active }, setActiveId) => {
  setActiveId(active.id);
};

export const handleDragCancel = (setActiveId) => {
  setActiveId(null);
};

export const handleDragEnd = ({ active, over }, setActiveId, setRaw) => {
  if (!over) {
    setActiveId(null);
    return;
  }

  if (active.id !== over.id) {
    const activeContainer = active.data.current?.sortable?.containerId;
    const overContainer = over.data.current?.sortable?.containerId;
    const activeIndex = active.data.current.sortable.index;
    const overIndex = over?.data?.current?.sortable.index;

    if (overIndex === 0 && overContainer === "table") return;

    if (activeContainer !== overContainer) return;
    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    setRaw((old) => {
      old[activeContainer].cards = arrayMove(
        old[activeContainer].cards,
        activeIndex,
        overIndex
      );
      return old;
    });
  }

  setActiveId(null);
};

export const handleDragOver = ({ active, over }, setRaw) => {
  if (over?.data?.current?.allCards.length >= over?.data?.current?.maxHandSize)
    return;
  if (active?.data?.current?.confirmed)
    //stop drag and drop if already submitted  cards
    return;
  if (active.id !== over?.id || over?.id) {
    const activeContainer = active?.data.current?.sortable?.containerId;
    const overContainer = over?.data?.current?.sortable?.containerId;
    const activeIndex = active?.data.current?.sortable?.index;
    const overIndex = over?.data?.current?.sortable?.index;

    if (overIndex === 0) return;
    if (activeContainer === overContainer || !over?.id) return;

    if (overContainer === "table" || over.id === "table") {
      //dont move black card
      const pick = over?.data?.current?.allCards[0]?.pick;
      const maxLength = pick + 1;
      const currentLength = over?.data?.current?.allCards.length;

      if (currentLength >= maxLength) return;

      setRaw((prev) => {
        const newDeck = { ...prev };
        const incoming = newDeck[activeContainer].cards.splice(activeIndex, 1);
        let cards = newDeck.table.cards;

        newDeck.table.cards = [...cards.splice(0, cards.length), ...incoming];

        return newDeck;
      });
    }

    if (overContainer === "player" && overContainer !== activeContainer) {
      setRaw((prev) => {
        const newDeck = { ...prev };
        const incoming = newDeck[activeContainer].cards.splice(activeIndex, 1);
        let cards = newDeck.player.cards;

        newDeck.player.cards = [
          ...cards.splice(0, activeIndex),
          ...incoming,
          ...cards,
        ];
        return newDeck;
      });
    }
  }
};
