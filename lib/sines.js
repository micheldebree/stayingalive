function sine (len, amp, i) {
  return amp * Math.sin((i / len) * Math.PI * 2.0)
}

module.exports = {
  positiveSine: (_unused, amplitude, length) =>
    Array(length)
      .fill(0)
      .map((v, i) => amplitude + amplitude * Math.sin((i * Math.PI * 2.0) / length)),
  sine: (_unused, center, amp, len) =>
    Array(len)
      .fill(0)
      .map((v, i) => center - sine(len, amp, i)),
  bounce: (_unused, center, amp, len) =>
    Array(len)
      .fill(0)
      .map((v, i) => center - Math.abs(sine(len, amp, i)))
}
