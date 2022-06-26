import CODE_JS_SRC from "/public/code.js?raw";
import SCRATCH_PAPER_README_MD_SRC from "/public/Scratch-Paper.md?raw";
import { createProjectFile, createUserFile } from "common/util";
import ROOT_README_MD_SRC from "/README.md?raw";

export const CODE_JS = createUserFile("code.js", CODE_JS_SRC);
export const SCRATCH_PAPER_README_MD = createProjectFile(
  "README.md",
  SCRATCH_PAPER_README_MD_SRC
);
export const ROOT_README_MD = createProjectFile(
  "README.md",
  ROOT_README_MD_SRC
);
