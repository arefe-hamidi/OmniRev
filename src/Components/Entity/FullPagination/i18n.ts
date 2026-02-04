import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary"

const en = {
    pageSize: "Rows per page",
    info: {
        to: "to",
        of: "of",
        entries: "entries"
    }
}

const fr: iDictionary = {
  pageSize: "Lignes par page",
  info: {
    to: "à",
    of: "sur",
    entries: "entrées",
  },
};

export type iDictionary = typeof en;
export const getDictionary = getDictionaryGenerator<typeof en>({ en, fr });
