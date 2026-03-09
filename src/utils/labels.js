export const TASK_STATUS_LABELS = {
  locked: "Закрыто",
  available: "Доступно",
  completed: "Выполнено",
};

export const ARTICLE_STATUS_LABELS = {
  locked: "Закрыто",
  available: "Доступно",
};

export const TRANSPORT_LABELS = {
  walk: "Пешком",
  scooter: "Самокат",
  car: "Авто",
};

export const TASK_TYPE_LABELS = {
  observation: "Наблюдение",
  reflection: "Разбор",
  analysis: "Аналитика",
  quiz: "Мини-квиз",
};

/**
 * @param {string} status
 */
export function formatTaskStatus(status) {
  return TASK_STATUS_LABELS[/** @type {keyof typeof TASK_STATUS_LABELS} */ (status)] || status;
}

/**
 * @param {string} status
 */
export function formatArticleStatus(status) {
  return ARTICLE_STATUS_LABELS[/** @type {keyof typeof ARTICLE_STATUS_LABELS} */ (status)] || status;
}

/**
 * @param {string} type
 */
export function formatTaskType(type) {
  return TASK_TYPE_LABELS[/** @type {keyof typeof TASK_TYPE_LABELS} */ (type)] || type;
}

/**
 * @param {string} transport
 */
export function formatTransportMode(transport) {
  return TRANSPORT_LABELS[/** @type {keyof typeof TRANSPORT_LABELS} */ (transport)] || transport;
}
