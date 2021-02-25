/**
 * 
 * @param {Object} target The initial object that will be used as a based to merge 
 * @param {Object} source The object that will be merged into target
 * 
 * @return {Object} A merged object from target and source
 *  */ 
export function merge(target, source) {
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object) Object.assign(source[key], merge(target[key], source[key]))
    }
  
    // Join `target` and modified `source`
    Object.assign(target || {}, source)
    return target
  }
  

export function isUndefOrNull(o) {
    return typeof o === "undefined" || o === null;
  }


export function isUndefOrNaN(o) {
    return Number.isNaN(o) || typeof o === "undefined";
}