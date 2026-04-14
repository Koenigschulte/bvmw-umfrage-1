let votes = { A: 0, B: 0, C: 0 };

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { option } = req.body;
    if (option && ['A', 'B', 'C'].includes(option)) {
      votes[option]++;
      res.status(200).json({ success: true, votes });
    } else {
      res.status(400).json({ error: 'Invalid option' });
    }
  } else {
    res.status(200).json(votes);
  }
}
