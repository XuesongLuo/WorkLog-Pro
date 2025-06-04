// utils/blankProgress.js
module.exports = () => ({
  pak : blankPak(),   
  wtr : blankWtr(),   
  str : blankStr(),   
  payment : 0,
  comments: '',
});

function blankPak () {
  return {
    active            : false,
    startDate         : '',
    pout              : false,
    pack              : false,
    estimateSend      : false,
    estimateSendAmount: '',
    estimateReview    : false,
    estimateReviewAmount: '',
    estimateAgree     : false,
    estimateAgreeAmount : '',
  };
}

function blankWtr () {
  return {
    active            : false,
    startDate         : '',
    ctrc              : false,
    demo              : false,
    itel              : false,
    eq                : false,
    pick              : false,
    estimateSend      : false,
    estimateSendAmount: '',
    estimateReview    : false,
    estimateReviewAmount: '',
    estimateAgree     : false,
    estimateAgreeAmount : '',
  };
}

function blankStr () {
  return {
    active            : false,
    startDate         : '',
    ctrc              : false,
    estimateSend      : false,
    estimateSendAmount: '',
    estimateReview    : false,
    estimateReviewAmount: '',
    estimateAgree     : false,
    estimateAgreeAmount : '',
  };
}