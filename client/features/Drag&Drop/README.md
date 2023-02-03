# How to use Drag and Drop

## in your Page where you want to use DnD, import the `DragAndDropContainer`, wrap it around your page content and pass down your **main data** as `data` and a **Function** to change your data after dropping, for example from `useState`, and the Component **AS FUNCTION** you want to use, maybe a `<Card/>` and all props you want to use on your **Component**

## Your custom **Component** receives every `prop` you'd pass to `DragAndDropContainer` so you can use for example className or specific data

### Example :

```js
<DragAndDropContainer data={data} setData={setData} element={Card} {...props}>
  Page content
</DragAndDropContainer>
```

## **_Importand!_** actuall we used the follow structure for data

```js
{
  zone:{label: uniqueString, cards:[Object, Object...]},
  zone:{label: uniqueString, cards:[Object, Object...]}
}
```

## This container creates based on your data a `<ul>...</ul>` with drag and droppable items as your desired Component

# Visuals

## while dragging, the element you dragging looks like the default element, its also possible to use a Custom element to visualize your draggin item with `<DragOverlay></Dragoverlay>`

### Examples:

- Overlay based on your given Component

```js
<DragOverlay>{activeId ? <DragItem id={activeId} /> : null}</DragOverlay>
```

- Overlay with an image

```js
<DragOverlay>
  <img src="img/URL" />
</DragOverlay>
```

# Example code for the Page, also for testing the implementation

## By using this code inside your main Page you can test the implemantation

```js
import { useState } from "react";
import DragAndDropContainer from "../features/Drag&Drop";

function App() {
  const [data, setData] = useState({
    stock: {
      label: "stock",
      cards: [{ text: "Card1" }, { text: "Card2" }, { text: "Card3" }],
    },
    player1: {
      label: "player1",
      cards: [{ text: "Card10" }, { text: "Card20" }, { text: "Card30" }],
    },
  });

  function TestComponent(props) {
    const { text } = props.card;

    return <h2>{text}</h2>;
  }

  return (
    <>
      <DragAndDropContainer
        data={data}
        setData={setData}
        element={TestComponent}>
        <h1>Hello</h1>
      </DragAndDropContainer>
    </>
  );
}

export default App;
```
