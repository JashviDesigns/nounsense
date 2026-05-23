type SuffixRule = {
  suffix: string;
  hint: string;
};

/**
 * Only endings with a reliable pattern. Examples are unrelated words —
 * never the player's noun or its English translation.
 */
const SUFFIX_RULES: SuffixRule[] = [
  {
    suffix: "schaft",
    hint: "The ending -schaft often goes with feminine nouns (e.g. Freundschaft, Mannschaft). Does yours share that ending?",
  },
  {
    suffix: "keit",
    hint: "The ending -keit often goes with feminine nouns (e.g. Möglichkeit, Süßigkeit). Does yours share that ending?",
  },
  {
    suffix: "heit",
    hint: "The ending -heit often goes with feminine nouns (e.g. Freiheit, Gesundheit). Does yours share that ending?",
  },
  {
    suffix: "ung",
    hint: "The ending -ung often goes with feminine nouns (e.g. Zeitung, Wohnung). Does yours share that ending?",
  },
  {
    suffix: "tion",
    hint: "The ending -tion often goes with feminine nouns (e.g. Nation, Station). Does yours share that ending?",
  },
  {
    suffix: "sion",
    hint: "The ending -sion often goes with feminine nouns (e.g. Vision, Diskussion). Does yours share that ending?",
  },
  {
    suffix: "tät",
    hint: "The ending -tät often goes with feminine nouns (e.g. Universität, Qualität). Does yours share that ending?",
  },
  {
    suffix: "ik",
    hint: "The ending -ik often goes with feminine nouns (e.g. Musik, Politik). Does yours share that ending?",
  },
  {
    suffix: "chen",
    hint: "The ending -chen is a diminutive and usually neuter (e.g. Mädchen, Brötchen). Does yours share that ending?",
  },
  {
    suffix: "lein",
    hint: "The ending -lein is a diminutive and usually neuter (e.g. Fräulein). Does yours share that ending?",
  },
  {
    suffix: "ment",
    hint: "The ending -ment is often neuter (e.g. Instrument, Dokument). Does yours share that ending?",
  },
  {
    suffix: "um",
    hint: "The ending -um is often neuter (e.g. Museum, Zentrum). Does yours share that ending?",
  },
  {
    suffix: "ismus",
    hint: "The ending -ismus is often masculine (e.g. Optimismus, Tourismus). Does yours share that ending?",
  },
  {
    suffix: "ling",
    hint: "The ending -ling is often masculine (e.g. Frühling, Schmetterling). Does yours share that ending?",
  },
];

/** Vague prompts — no compounds, no category sets, no English cognates. */
const GENERIC_HINTS = [
  "Try whispering a short phrase with this word — which article sounds more natural?",
  "Look at the last two or three letters. Do they match a pattern you've seen in other German words?",
  "If no rule jumps out, recall a song, label, or sentence where you've heard this word before.",
  "Some words are safest learned as a fixed pair: always say the article and noun together.",
  "German gender has many exceptions here — narrow it down to two options and trust your ear.",
  "Scan the middle and end of the word for a familiar chunk you've seen in another noun.",
];

const PLURAL_NOUNS = new Set(["Bücher", "Zwiebeln", "Blumen"]);

const PLURAL_HINT =
  "This form looks plural. In German, plurals follow their own article rule — think about plural phrases you've heard.";

function matchSuffix(noun: string): SuffixRule | null {
  const lower = noun.toLowerCase();
  const sorted = [...SUFFIX_RULES].sort(
    (a, b) => b.suffix.length - a.suffix.length,
  );
  return sorted.find((r) => lower.endsWith(r.suffix)) ?? null;
}

function pickGenericHint(noun: string): string {
  const index =
    [...noun].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) %
    GENERIC_HINTS.length;
  return GENERIC_HINTS[index]!;
}

export type ArticleHint = {
  text: string;
};

export function getArticleHint(noun: string): ArticleHint {
  const key = noun.trim();

  if (PLURAL_NOUNS.has(key)) {
    return { text: PLURAL_HINT };
  }

  const suffix = matchSuffix(key);
  if (suffix) {
    return { text: suffix.hint };
  }

  return { text: pickGenericHint(key) };
}
