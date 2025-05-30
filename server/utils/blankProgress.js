module.exports = () => ({
  pak:  stageBlank(),
  wtr:  stageBlank(),
  str:  stageBlank(),
  payment: 0,
  comments: ''
});

function stageBlank() {
  return {
    active: false,
    startDate: '',
    pout: false, pack: false, ctrc: false, demo: false,
    itel: false, eq: false, pick: false,
    estimateSend: false,  estimateSendAmount: '',
    estimateReview: false, estimateReviewAmount: '',
    estimateAgree: false,  estimateAgreeAmount: ''
  };
}