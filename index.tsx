// VIRTUAL DOM
const React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag === "function") {
      try {
        return tag(props);
      } catch ({ promise, key }) {
        promise.then((data) => {
          promiseCache.set(key, data);
          reRender();
        });
        return { tag: "h1", props: { children: ["Loading..."] } };
      }
    }
    const element = { tag, props: { ...props, children } };
    return element;
  },
};

//GLOBAL STORE TO STORE STATES

const states = [];
let stateCursor = 0;

//HOOKS
const useState = (initialState) => {
  const frozenCursor = stateCursor;
  states[frozenCursor] = states[frozenCursor] || initialState;
  const setState = (newState) => {
    states[frozenCursor] = newState;
    reRender();
  };
  stateCursor++;
  return [states[frozenCursor], setState];
};

const useEffect = (callback, dependancyArray) => {
  //todo
};

const promiseCache = new Map();
const createResource = (promise, key) => {
  if (promiseCache.has(key)) {
    return promiseCache.get(key);
  }
  throw { promise, key };
};

//RENDER AND RE-RENDER
const render = (reactElementOrStringOrNumber, container) => {
  if (
    typeof reactElementOrStringOrNumber === "string" ||
    typeof reactElementOrStringOrNumber === "number"
  ) {
    return container.appendChild(
      document.createTextNode(String(reactElementOrStringOrNumber))
    );
  }

  const { tag, props } = reactElementOrStringOrNumber;

  const actualDom = document.createElement(tag);

  if (props) {
    Object.keys(reactElementOrStringOrNumber.props)
      .filter((key) => key !== "children")
      .forEach(
        (key) => (actualDom[key] = reactElementOrStringOrNumber.props[key])
      );
  }
  if (props.children) {
    props.children.forEach((child) => render(child, actualDom));
  }
  container.appendChild(actualDom);
};

const reRender = () => {
  stateCursor = 0;
  document.getElementById("root").firstChild.remove();
  render(<App />, document.getElementById("root"));
};

//COMPONENT
const App = () => {
  const dogPhoto = createResource(
    fetch("https://dog.ceo/api/breeds/image/random")
      .then((res) => res.json())
      .then((data) => data.message),
    "dogPhoto"
  );

  const [name, setName] = useState("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("useEffect");
  }, []);

  return (
    <div className="myReact">
      <h1>Hi, this is {name}</h1>
      <h2 className="h1Classname">This is my react</h2>
      <p>I'm making it on my own</p>
      <input
        placeholder="input"
        value={name}
        onchange={(e) => {
          setName(e.target.value);
        }}
      />
      <button onclick={() => setCount(count + 1)}>+</button>
      <button onclick={() => setCount(count - 1)}>-</button>
      <div>count is: {count}</div>
      <img src={dogPhoto} alt="my doggo" />
    </div>
  );
};

//CALLING RENDER
render(<App />, document.getElementById("root"));
