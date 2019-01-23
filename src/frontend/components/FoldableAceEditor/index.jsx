import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/plain_text';
import 'brace/mode/markdown';
import 'brace/mode/json';
import 'brace/mode/javascript';
import 'brace/mode/c_cpp';
import 'brace/mode/java';
import 'brace/theme/tomorrow_night_eighties';
import 'brace/ext/searchbox';

class FoldableAceEditor extends AceEditor {
  componentDidMount() {
    super.componentDidMount();

    this.foldTracers();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    super.componentDidUpdate(prevProps, prevState, snapshot);

    if (prevProps.foldAt !== this.props.foldAt) {
      this.foldTracers();
    }
  }

  foldTracers() {
    const session = this.editor.getSession();
    for (let row = 0; row < session.getLength(); row++) {
      if (!/^\s*\/\/.+{\s*$/.test(session.getLine(row))) continue;
      const range = session.getFoldWidgetRange(row);
      if (range) {
        session.addFold('...', range);
        row = range.end.row;
      }
    }
  }
}

export default FoldableAceEditor;
