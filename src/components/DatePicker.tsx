import { default as DateTimePicker } from "@react-native-community/datetimepicker";
import { Button } from "@ui-kitten/components";
import { useState } from "react";

interface DatePickerProps {
  dataPreEstabelecida: Date,
  tipo: 'date' | 'time',
  tamanBtn: 'tiny' | 'small',
  status?: 'primary' | 'warning' | 'danger'
  setarData: (tipo: 'DATA' | 'HORA', data?: string, hora?: string) => void
}

export const DatePicker: React.FC<DatePickerProps> = ({ dataPreEstabelecida, tipo, tamanBtn, setarData, status = 'primary' }) => {

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const showDatePicker = () => {
    setShowPicker(true);
  };

  const onChange = (event: any, selectedDate?: Date) => {
    
    if (event.type === 'set') {
      const currentDate = selectedDate || date;
      setShowPicker(false);
      if (tipo === 'date') {
        setarData('DATA', currentDate.toLocaleDateString())
      } else {
        setarData('HORA', currentDate.toLocaleTimeString())
      }
      return;
    }
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };

  return (
    <>
      <Button status={status} size={tamanBtn} appearance="outline" onPress={showDatePicker}>
        {
          (tipo === 'date')?
          dataPreEstabelecida.toLocaleDateString()
          :
          dataPreEstabelecida.toLocaleTimeString()
        }
      </Button>

      {showPicker && (
        <DateTimePicker
          value={dataPreEstabelecida}
          mode={tipo}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </>
  )
}