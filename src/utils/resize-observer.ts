interface Props {
  onInit?: {
    (element: Element): void;
  };
  onResizing?: {
    (entry: ResizeObserverEntry): void;
  };
}

export default function (el: Element, props: Props): ResizeObserver {
  props.onInit?.call(null, el);
  const observer = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      props.onResizing?.call(null, entry);
    });
  });
  el && observer.observe(el);
  return observer;
}
