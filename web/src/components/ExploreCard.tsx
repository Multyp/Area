'use client';

import { forwardRef, Ref } from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea, CardProps } from '@mui/material';

export interface ExploreCardProps extends CardProps {
  id: string;
  url: string;
  title: string;
  description: string;
  image: string;
}

const ExploreCard = forwardRef(({ id, url, title, description, image, ...other }: ExploreCardProps, ref: Ref<HTMLDivElement>) => {
  return (
    <Card ref={ref} {...other} sx={{ height: '100%' }}>
      <CardActionArea href={url} sx={{ height: '100%' }}>
        <CardMedia component="img" height="140" image={image} alt={title} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
});

ExploreCard.displayName = 'ExploreCard';

export default ExploreCard;
