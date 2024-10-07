export const validateDiscount = (
  publisherDiscount,
  discountStart,
  discountEnd
) => {
  const currentDate = new Date();
  const start = new Date(discountStart);
  const end = new Date(discountEnd);

  const currentDateOnly = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const startDateOnly = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const endDateOnly = new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate()
  );

  endDateOnly.setDate(endDateOnly.getDate() + 1);

  if (currentDateOnly >= startDateOnly && currentDateOnly <= endDateOnly) {
    return publisherDiscount;
  }
  return 0;
};

export const calculateFinalPrice = (book) => {
  const validatedDiscount = validateDiscount(
    book.publisher_discount,
    book.discount_start,
    book.discount_end
  );
  const finalPrice =
    validatedDiscount > 0
      ? book.price - book.price * (validatedDiscount / 100)
      : book.price;

  return parseFloat(finalPrice);
};
