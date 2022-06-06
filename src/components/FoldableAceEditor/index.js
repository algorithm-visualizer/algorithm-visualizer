import AceEditor from "react-ace";
import { connect } from "react-redux";
import "brace/ext/searchbox";
import "brace/mode/javascript";
import "brace/mode/markdown";
import "brace/mode/plain_text";
import "brace/theme/tomorrow_night_eighties";
import { extension } from "common/util";
import { actions } from "reducers";

class FoldableAceEditor extends AceEditor {
  componentDidMount() {
    super.componentDidMount();

    const { shouldBuild } = this.props.current;
    if (shouldBuild) this.foldTracers();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    super.componentDidUpdate(prevProps, prevState, snapshot);

    const { editingFile, shouldBuild } = this.props.current;
    if (editingFile !== prevProps.current.editingFile) {
      if (shouldBuild) this.foldTracers();
    }
  }

  foldTracers() {
    const { editingFile } = this.props.current;
    const fileExt = extension(editingFile.name);
    if (!["md", "js"].includes(fileExt)) return;
    const session = this.editor.getSession();
    for (let row = 0; row < session.getLength(); row++) {
      if (!/^\s*\/\/.+{\s*$/.test(session.getLine(row))) continue;
      const range = session.getFoldWidgetRange(row);
      if (range) {
        session.addFold("...", range);
        row = range.end.row;
      }
    }
  }

  resize() {
    this.editor.resize();
  }
}

export default connect(({ current }) => ({ current }), actions, null, {
  forwardRef: true,
})(FoldableAceEditor);
