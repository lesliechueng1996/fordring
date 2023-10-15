import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qiniu from 'qiniu';

export const UPLOAD_TOKEN_EXPIRE_SECONDS = 5 * 60;

@Injectable()
export class QiniuService {
  bucket: string;
  accessKey: string;
  secretKey: string;
  mac: qiniu.auth.digest.Mac;

  constructor(configService: ConfigService) {
    this.bucket = configService.get('QINIU_BUCKET');
    this.accessKey = configService.get('QINIU_ACCESS_KEY');
    this.secretKey = configService.get('QINIU_SECRET_KEY');
    this.mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
  }

  simpleUploadToken() {
    const options = {
      scope: this.bucket,
      expires: UPLOAD_TOKEN_EXPIRE_SECONDS,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(this.mac);
    return uploadToken;
  }
}
