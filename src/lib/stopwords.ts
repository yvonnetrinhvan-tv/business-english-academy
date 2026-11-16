// Từ phổ biến bỏ qua khi trích từ vựng từ tài liệu.
export const STOPWORDS = new Set(`
about above after again against all also although always among and another any are around because been before being below between
both but can cannot could did does doing done down during each either else even ever every few for from further had has have having
her here hers him his how however into its itself just least less like made make many may might more most much must myself neither
never none nor not now off often once only onto other others our ours out over own per perhaps rather same shall she should since
some such than that the their theirs them then there these they this those though through thus too under until upon very was were
what when where whether which while who whom whose why will with within without would yet you your yours
able back come came come each give goes going gone good got great know last long look made need next only part put said say see
seem seen take taken tell thing things think time told took use used using want way well went work year years
one two three four five six seven eight nine ten first second third new old high low big small
january february march april june july august september october november december monday tuesday wednesday thursday friday saturday sunday
`.split(/\s+/).filter(Boolean))
