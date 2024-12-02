import PropTypes from "prop-types";
import React from "react";
import { useInView } from "react-intersection-observer";

const InfiniteScrollContainer = ({ onBottomReached, className, children }) => {
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
  onBottomReached: PropTypes.func.isRequired,
  className: PropTypes.string,
};
