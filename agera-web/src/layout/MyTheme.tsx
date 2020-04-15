import { createMuiTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';

export const myTheme = createMuiTheme({
    //spacing: {
    //    unit: 0.5
    //},
    palette: {
        primary: { main: '#002F4C' },
        secondary: { main: '#002F4C' },
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
    } as any,
    typography: {
        // Use the system font instead of the default Roboto font.
        fontSize: 12,
        fontFamily: [
            'Helvetica',
            'sans-serif',
/*            
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Arial',
            'sans-serif',
*/            
        ].join(',')
    },
    overrides: {
        MuiTableRow: {
            head: {
                //backgroundColor: 'lightgray',
                "& > th ": {
                    color: 'black',
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    margin: '5 5 5 5'
                },
                height: '20px'
            },
            root: {
                height: '20px',
            },
        },
        MuiToolbar: {
            root: {
            },
        
        }
    }
});
