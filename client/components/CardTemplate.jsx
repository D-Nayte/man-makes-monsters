import style from "../styles/cardTemplate.module.css";

const CardTemplate = (props) => {
  const { id, isBlackCard, card, blackText, isSkell, isOverlay, index, table } =
    props;
  let cardClass;

  (() => {
    //Add classname for black cards, white cards or skellettons
    if (card) {
      const { pick, pack } = card;

      if (pick) {
        return (cardClass = `${style.cardTemplateContainer} ${style.black}`);
      } else if (pack >= 0 && pack !== undefined) {
        return (cardClass = `${style.cardTemplateContainer}`);
      } else if (isSkell)
        return (cardClass = `${style.cardTemplateContainer} ${"skeleton"}`);
    }
    if (isOverlay) return (cardClass = `${style.cardTemplateContainer}`);
    return (cardClass = `${style.cardTemplateContainer} ${style.hide}`);
  })();

  return (
    <>
      <div
        key={id + index + card?.text + isOverlay + table + isSkell}
        className={cardClass}>
        {!isBlackCard ? id : blackText}
      </div>
    </>
  );
};

export default CardTemplate;
