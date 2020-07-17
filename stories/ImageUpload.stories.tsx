import React from 'react';
import { storiesOf } from '@storybook/react';

import ImageUpload from '../src/ImageUpload';

storiesOf('ImageUpload', module).add('default', () => (
    <ImageUpload upload={() => ({ imageUrl: '123' })} removeImage={<div>Remove</div>}>
        <span>Upload Button</span>
    </ImageUpload>
));
