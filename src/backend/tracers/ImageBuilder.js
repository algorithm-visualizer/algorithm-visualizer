import path from 'path';
import { execute } from '/common/util';

class ImageBuilder {
  constructor(lang) {
    this.lang = lang;
    this.directory = path.resolve(__dirname, lang);
    this.imageName = `tracer-${this.lang}`;

    this.build = this.build.bind(this);
  }

  build(release) {
    const { tag_name } = release;
    return execute(`docker build -t ${this.imageName} . --build-arg tag_name=${tag_name}`, this.directory);
  }
}

export default ImageBuilder;
