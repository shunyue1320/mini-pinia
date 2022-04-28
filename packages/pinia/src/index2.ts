import { effectScope } from 'vue'
var a = () => {
  console.log('1345678')
  effectScope(() => {})
  if (__VERSION__ === '1.0.0') {
    return __VERSION__
  }
  return 1
}

a()
console.log(a())

export default a
