import { SetMetadata } from '@nestjs/common';

// Define the decorator
export const Message = (message: string) => SetMetadata('message', message);