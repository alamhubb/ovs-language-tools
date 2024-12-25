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

