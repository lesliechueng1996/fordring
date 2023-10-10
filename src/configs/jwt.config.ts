import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

const jwtModule = JwtModule.registerAsync({
  global: true,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.get('JWT_SECRET'),
    signOptions: {
      expiresIn: '10m',
    },
  }),
});

export default jwtModule;
