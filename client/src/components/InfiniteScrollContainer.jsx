import PropTypes from "prop-types";
import React from "react";
import { useInView } from "react-intersection-observer";

const InfiniteScrollContainer = ({ children, onBottomReached, className }) => {
  const { ref } = useInView({
    rootMargin: "200px",
    onChange(inView) {
      if (inView) onBottomReached();
    },
  });

  return (
    <div className={className}>
      {children}
      <div ref={ref} />
    </div>
  );
};

export default InfiniteScrollContainer;

InfiniteScrollContainer.prototype = {
  children: PropTypes.node.isRequired,
  onBottomReached: PropTypes.func.isRequired,
  className: PropTypes.string,
};
