"use strict";
"use server";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.cognitoValidateAccessToken = cognitoValidateAccessToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwk_to_pem_1 = __importDefault(require("jwk-to-pem"));
async function cognitoValidateAccessToken(token, config) {
  const response = await fetch(
    `https://cognito-idp.${config.awsRegion}.amazonaws.com/${config.userPoolId}/.well-known/jwks.json`,
    { headers: { "Content-Type": "application/json" } },
  );
  const body = await response.json();
  if (!body || !body.keys || body.keys.length === 0) {
    throw new Error("Invalid JWT body");
  }
  const pem = (0, jwk_to_pem_1.default)(body.keys[1]);
  try {
    await new Promise((resolve, reject) => {
      jsonwebtoken_1.default.verify(token, pem, (err, payload) => {
        if (err) {
          reject(new Error("Invalid token"));
        } else {
          resolve(payload);
        }
      });
    });
    return true;
  } catch (err) {
    return false;
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29nbml0by12YWxpZGF0ZS1hY2Nlc3MtdG9rZW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9ucy9jb2duaXRvLXZhbGlkYXRlLWFjY2Vzcy10b2tlbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFDOzs7OztBQUtiLGdFQStCQztBQW5DRCxnRUFBK0I7QUFDL0IsNERBQWtDO0FBRzNCLEtBQUssVUFBVSwwQkFBMEIsQ0FDOUMsS0FBYSxFQUNiLE1BQWM7SUFFZCxNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FDMUIsdUJBQXVCLE1BQU0sQ0FBQyxTQUFTLGtCQUFrQixNQUFNLENBQUMsVUFBVSx3QkFBd0IsRUFDbEcsRUFBRSxPQUFPLEVBQUUsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUUsRUFBRSxDQUNwRCxDQUFDO0lBRUYsTUFBTSxJQUFJLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbkMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDbEQsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFBLG9CQUFRLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRW5DLElBQUksQ0FBQztRQUNILE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDcEMsc0JBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRTtnQkFDdEMsSUFBSSxHQUFHLEVBQUUsQ0FBQztvQkFDUixNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDckMsQ0FBQztxQkFBTSxDQUFDO29CQUNOLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDbkIsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2IsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHNlcnZlclwiO1xuaW1wb3J0IEpXVCBmcm9tIFwianNvbndlYnRva2VuXCI7XG5pbXBvcnQgandrVG9QZW0gZnJvbSBcImp3ay10by1wZW1cIjtcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29nbml0b1ZhbGlkYXRlQWNjZXNzVG9rZW4oXG4gIHRva2VuOiBzdHJpbmcsXG4gIGNvbmZpZzogQ29uZmlnLFxuKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXG4gICAgYGh0dHBzOi8vY29nbml0by1pZHAuJHtjb25maWcuYXdzUmVnaW9ufS5hbWF6b25hd3MuY29tLyR7Y29uZmlnLnVzZXJQb29sSWR9Ly53ZWxsLWtub3duL2p3a3MuanNvbmAsXG4gICAgeyBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0gfSxcbiAgKTtcblxuICBjb25zdCBib2R5ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICBpZiAoIWJvZHkgfHwgIWJvZHkua2V5cyB8fCBib2R5LmtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBKV1QgYm9keVwiKTtcbiAgfVxuXG4gIGNvbnN0IHBlbSA9IGp3a1RvUGVtKGJvZHkua2V5c1sxXSk7XG5cbiAgdHJ5IHtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBKV1QudmVyaWZ5KHRva2VuLCBwZW0sIChlcnIsIHBheWxvYWQpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJJbnZhbGlkIHRva2VuXCIpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHBheWxvYWQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiJdfQ==
