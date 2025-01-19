// redis.module.ts
import { Module } from '@nestjs/common';
// import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from './redis.service';

@Module({
  imports: [
    // RedisModule.forRoot({
    //   config: {
    //     host: 'localhost', // آدرس Redis
    //     port: 6379, // پورت Redis
    //     password: '', // اگر رمزگذاری شده باشد، رمز را وارد کن
    //   },
    // }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisConfigModule {}
