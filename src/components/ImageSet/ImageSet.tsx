import React from 'react';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Grid, Input } from '@material-ui/core';

import { StoreContext } from 'components/StoreContext';

import { IimageSet } from 'store/imageSetModel';
import { ResponsiveImage } from 'components/ResponsiveImage';
import { axios } from 'utils/axios';

interface ImageSetProps extends RouteComponentProps<{ imageSetId: string }> {}

@observer
export class ImageSet extends React.Component<ImageSetProps> {
  static contextType = StoreContext;
  context!: React.ContextType<typeof StoreContext>;

  @observable
  imageSet?: IimageSet;

  loadImageSet = () => {
    this.imageSet = this.context.user?.imageSets.get(this.props.match.params.imageSetId);
  };

  componentDidMount() {
    if (!this.context.user) {
      reaction(() => this.context.user, this.loadImageSet);
    } else {
      this.loadImageSet();
    }
  }

  onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files) {
      const image = files[0];
      const formData = new FormData();
      formData.append('image', image, image.name);
      this.imageSet?.addImage(formData);
    }
  };

  render() {
    if (!this.imageSet) return null;

    return (
      <Grid container spacing={3}>
        <Grid item md={10}>
          <Input type="file" onChange={this.onFileChange} />
          <ResponsiveImage src={this.imageSet.selectedImage.url} alt="" />
        </Grid>
        <Grid item md={2}>
          {this.imageSet.imagesAsArray.map((image) => (
            <Button key={image.id} onClick={() => this.imageSet?.setSelectedImage(image)}>
              <ResponsiveImage src={image.url} />
            </Button>
          ))}
        </Grid>
      </Grid>
    );
  }
}
