let warned = false;

export function translateOffset(start: number, fromOffsets: number[], toOffsets: number[], fromLengths: number[], toLengths: number[] = fromLengths): number | undefined {
  const isSorted = fromOffsets.every((value, index) => index === 0 || fromOffsets[index - 1] <= value);

  if (!isSorted) {
    for (let i = 0; i < fromOffsets.length; i++) {
      const fromOffset = fromOffsets[i];
      const fromLength = fromLengths[i];
      if (start >= fromOffset && start <= fromOffset + fromLength) {
        const toLength = toLengths[i];
        const toOffset = toOffsets[i];
        let rangeOffset = Math.min(start - fromOffset, toLength);
        return toOffset + rangeOffset;
      }
    }
    if (!warned) {
      warned = true;
      console.warn('fromOffsets should be sorted in ascending order');
    }
  }

  const res = searchOffset(start, fromOffsets, toOffsets, fromLengths, toLengths)

  return res
}


function searchOffset(searchOffset: number, fromOffsets: number[], toOffsets: number[], fromLengths: number[], toLengths: number[]) {
  const middleIndex = binarySearchRange(searchOffset, fromOffsets, fromLengths)
  if (middleIndex > -1) {
    //获取对应的开始位置和结束位置
    const fromOffset = fromOffsets[middleIndex];
    //找到了
    const toLength = toLengths[middleIndex];
    const toOffset = toOffsets[middleIndex];
    //当前位置减去开始位置得到位置偏移量，但是位置偏移量不能大于长度
    let rangeOffset = Math.min(searchOffset - fromOffset, toLength);
    return toOffset + rangeOffset;
  }
}

// 标准二分查找实现
function binarySearchRange(
  searchValue: number,
  startArray: number[],
  lengthAry: number[]
): number {
  let low = 0;
  let high = startArray.length - 1;

  while (low <= high) {

    const mid = Math.floor((low + high) / 2);
    const start = startArray[mid];
    const end = start + lengthAry[mid];
    console.log('low hi')
    console.log(mid)
    console.log(low)
    console.log(high)
    console.log(start)
    console.log(end)
    // 检查是否在当前范围内
    if (searchValue >= start && searchValue <= end) {
      return mid;  // 返回找到的索引
    } else if (searchValue < start) {
      high = mid - 1;  // 在左半部分查找
    } else {
      low = mid + 1;   // 在右半部分查找
    }
  }
  return -1
}


const ary1 = [
  0, 0, 0, 0, 39, 45, 47,
  49, 51, 58, 64, 70, 78, 78,
  78, 84, 85, 89, 96
]
const ary2 = [
  38, 0, 38, 0, 11, 1, 1,
  1, 54, 47, 5, 1, 6, 6,
  6, 1, 1, 7, 1
]
const ll = binarySearchRange(97, ary1, ary2)

console.log(ll)
