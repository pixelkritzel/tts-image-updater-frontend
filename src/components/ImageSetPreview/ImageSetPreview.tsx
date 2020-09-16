import React from 'react';
import { observer } from 'mobx-react';
import { Card } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

import { IimageSet } from 'store/imageSetModel';

interface ImageSetPreviewProps {
  imageSet: IimageSet;
}

const StyledCard = styled(Card)({
  position: 'relative',
  top: 0,
  transition: 'all .4s',
  '&:hover': {
    top: '-3px',
    boxShadow:
      '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
  },
});

const Caption = styled('div')({
  position: 'absolute',
  left: 0,
  bottom: 0,
  padding: '16px',
  backgroundColor: 'rgba(0,0,0, 0.4)',
  color: 'white',
});

@observer
export class ImageSetPreview extends React.Component<ImageSetPreviewProps> {
  render() {
    const { imageSet } = this.props;

    const Image = styled('div')({
      backgroundImage: `url(${imageSet.selectedImage.url})`,
      backgroundSize: 'cover',
      paddingBottom: '100%',
    });

    return (
      <StyledCard>
        <Caption>
          {imageSet.id}
          {imageSet.name}
        </Caption>
        <Image />
      </StyledCard>
    );
  }
}
