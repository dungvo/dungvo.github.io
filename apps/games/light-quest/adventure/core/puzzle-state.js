import {trace} from './optics.js';
export class PuzzleState{
 constructor(level){this.level=level;this.angles=level.mirrors.map(m=>m.angle);this.history=[]}
 get result(){return trace(this.level,this.angles)}
 rotate(index,delta=1){this.history.push([...this.angles]);this.angles[index]=(this.angles[index]+delta+8)%8;return this.result}
 undo(){if(this.history.length)this.angles=this.history.pop();return this.result}
 reset(){this.history=[];this.angles=this.level.mirrors.map(m=>m.angle);return this.result}
}
