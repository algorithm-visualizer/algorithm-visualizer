import uuid from 'uuid';

const key = 'dragging-data-id';

class DraggingData {
  constructor() {
    this.id = null;
    this.data = null;
  }

  set(e, data) {
    this.id = uuid.v4();
    this.data = data;
    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.setData(key, this.id);
  }

  get(e) {
    const id = e.dataTransfer.getData(key);
    if (id === this.id) return this.data;
  }
}

const draggingData = new DraggingData();
export default draggingData;