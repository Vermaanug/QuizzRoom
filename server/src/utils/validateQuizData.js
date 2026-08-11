const allowedStatuses = new Set(["draft", "published", "archived"]);

const validateQuizData = (req, { partial = false } = {}) => {
  const { title = "", status } = req.body;

  const errors = {};

  if (!partial || title !== undefined) {
    if (!String(title).trim()) {
      errors.title = "Title is required";
    } else if (String(title).trim().length > 120) {
      errors.title = "Title must be 120 characters or less";
    }
  }

  if (status !== undefined && !allowedStatuses.has(String(status))) {
    errors.status = "Status must be draft, published, or archived";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default validateQuizData;
