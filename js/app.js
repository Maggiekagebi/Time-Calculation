const { createApp, ref, computed, watch } = Vue;

createApp({
  setup() {
    // 時間差計算器狀態變數
    const startHour = ref('');
    const startMinute = ref('');
    const endHour = ref('');
    const endMinute = ref('');
    const result = ref({ hours: null, minutes: null });
    const error = ref('');
    
    // 未來時間計算器狀態變數
    const addHours = ref('');
    const futureTime = ref({
      current: '',
      future: '',
      calculated: false
    });
    
    // 選項資料
    const hourOptions = Array.from({ length: 24 }, (_, i) => i);
    const minuteOptions = Array.from({ length: 60 }, (_, i) => i);
    
    // 格式化時間函數
    const formatTime = (date) => {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };
    
    // 計算時間差異
    const calculateTimeDifference = () => {
      try {
        // 確保所有值都已選擇
        if (startHour.value === '' || startMinute.value === '' || 
            endHour.value === '' || endMinute.value === '') {
          result.value = { hours: null, minutes: null };
          return;
        }
        
        // 轉換為數字
        const start = new Date();
        start.setHours(parseInt(startHour.value), parseInt(startMinute.value), 0, 0);
        
        const end = new Date();
        end.setHours(parseInt(endHour.value), parseInt(endMinute.value), 0, 0);
        
        // 如果結束時間早於開始時間，假設是隔天
        if (end < start) {
          end.setDate(end.getDate() + 1);
        }
        
        // 計算差異（毫秒）
        const diffMs = end - start;
        
        // 計算小時和分鐘
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        // 設置計算結果為小時和分鐘
        result.value = { hours, minutes };
        error.value = '';
      } catch (err) {
        error.value = '計算時發生錯誤，請檢查輸入。';
        result.value = { hours: null, minutes: null };
      }
    };
    
    // 計算未來時間
    const calculateFutureTime = () => {
      try {
        if (addHours.value === '') {
          futureTime.value.calculated = false;
          return;
        }
        
        const now = new Date();
        const future = new Date();
        future.setHours(now.getHours() + parseInt(addHours.value));
        
        futureTime.value = {
          current: formatTime(now),
          future: formatTime(future),
          calculated: true
        };
      } catch (err) {
        futureTime.value.calculated = false;
      }
    };
    
    // 監聽輸入變化
    watch([startHour, startMinute, endHour, endMinute], () => {
      calculateTimeDifference();
    });
    
    watch(addHours, () => {
      calculateFutureTime();
    });
    
    // 重置所有輸入
    const resetAll = () => {
      startHour.value = '';
      startMinute.value = '';
      endHour.value = '';
      endMinute.value = '';
      result.value = { hours: null, minutes: null };
      error.value = '';
    };
    
    // 重置未來時間計算
    const resetFutureTime = () => {
      addHours.value = '';
      futureTime.value = {
        current: '',
        future: '',
        calculated: false
      };
    };
    
    return {
      startHour,
      startMinute,
      endHour,
      endMinute,
      result,
      error,
      hourOptions,
      minuteOptions,
      resetAll,
      addHours,
      futureTime,
      resetFutureTime
    };
  }
}).mount('#app');