const asyncHandler = (handlingFunction) => {
  return (req, res, next) => {
    return Promise.resolve(handlingFunction(req, res, next)).catch((err) =>
      next(err)
    );
  };
};

export default asyncHandler;
