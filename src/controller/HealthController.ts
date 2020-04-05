import { Response } from 'express';
import * as loopbench from 'loopbench';
import { Get, JsonController, Res } from 'routing-controllers';

@JsonController('/health')
export default class HealthController {

  @Get('/_health')
  public health(@Res() res: Response) {
    const loopbenchmark: loopbench.LoopBench = loopbench();
    const overloaded: boolean = loopbenchmark.delay > loopbenchmark.limit;

    if (overloaded) {
      res.statusCode = 503;
    }

    return { overloaded };
  }

  // @ToDo: implement
  // is this container ready for incoming connections?
  // sample query to db
  @Get('/_liveness')
  public liveness() {
    return { status: 'live' };
  }

  // @ToDo: implement
  // "does this container work or does it need to be replaced?"
  // check your app internals for health, but maybe
  // don't check for db connection, that's what readiness is for
  // this validates express is responding to requests
  // and not deadlocked
  // - If Kubelet fails this test, it kills and recreates pod
  @Get('/_readiness')
  public readiness() {
    return { status: 'ready' };
  }
}
