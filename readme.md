# proxy tool
Test whether the proxy , you may collected from internet, can be used.

  Usage: proxyt [options]                                                                                                                  
                                                                                                                                         
  Options:                                                                                                                               
                                                                                                                                         
    -h, --help               output usage information                                                                                    
    -V, --version            output the version number                                                                                   
    -d, --data [file]        Data file                                                                                                   
    -u, --url [link]         Test url                                                                                                    
    -t, --timeout [seconds]  Request timeout seconds                                                                                     
    -c, --config [file]      All the config file 

## Params

- -d The data file, you should given the format of `ip:port` in every line,for example,`207.182.139.74:80`. 
- -u The url you want to test.For example you want to test whether the proxy can request google, you can give the value of `https://google.com`
- -t The timeout limit for the proxy you used.Its unit is seconds.
- -c All of the params above can be setted in this file.It must be in json file.If you give one param both in command and configuration file,the value from the file will overwrite the command.

## Licence

[MIT](https://opensource.org/licenses/MIT)