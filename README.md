# Apuntes - [Principios S.O.L.I.D.]

## SRP (Single Responsibility Principle)

> A class should have one, and only one, reason to change.  
> -- Robert C. Martin

Aplicable a clases, componentes de software o microservicios.

Ayuda a crear código de calidad, mantenible, reusable, testeable, fácil de implementar y previene de efectos secundarios en los cambios.

Los requerimientos del código pueden cambiar con el tiempo. Cada uno de éstos cambia al menos la responsabilidad de una clase.

Si una clase tiene muchas responsabilidades deberá cambiar más a menudo que si sólo tuviera una responsabilidad. Estos cambios tan reiterados pueden introducir errores o efectos secundarios en otras partes del código. Por tanto, **una clase sólo debería cambiar por una única razón** o lo que es lo mismo, que cambie la responsabilidad de la que se ocupa.

Las clases con una única responsabilidad son más fáciles de mantener y más fáciles de explicar.

En el siguiente ejemplo tenemos la clase _Vehicle_ que modela un objeto de tipo _Vehicle_ y que además tiene la responsabilidad de repostar el vehículo. Por tanto si cambia el modelo _Vehicle_ o si cambia la forma de repostar combustible esta clase tendrá dos motivos para cambiar y por tanto no cumple el **_Principio de Responsabilidad Única_**.

![Diagram](https://raw.githubusercontent.com/alxgcrz/design-patterns-java/master/src/solid/srp/srp_violation_diagram.png)

```java
public class Vehicle {

    private final int maxFuel;
    private int remainingFuel;

    public Vehicle(final int maxFuel) {
        this.maxFuel = maxFuel;
        remainingFuel = maxFuel;
    }

    // Esto no es responsabilidad de la clase 'Vehicle'
    public void reFuel() {
        remainingFuel = maxFuel;
    }

    public int getMaxFuel() {
        return maxFuel;
    }

    public int getRemainingFuel() {
        return remainingFuel;
    }

    // ....
}
```

Para aplicar el **_Principio de Responsabilidad Única_** deberemos refactorizar la clase _Vehicle_ y crear una clase como por ejemplo _FuelPump_ cuya responsabilidad sea el repostaje de combustible del vehículo, eliminando este método de la clase _Vehicle_.

![Diagram](https://raw.githubusercontent.com/alxgcrz/design-patterns-java/master/src/solid/srp/srp_solution_diagram.png)

```java
public class FuelPump {

    public void reFuel(final Vehicle vehicle) {
        final int remainingFuel = vehicle.getRemainingFuel();
        final int additionalFuel = vehicle.getMaxFuel() - remainingFuel;
        vehicle.setRemainingFuel(remainingFuel + additionalFuel);
    }
}
```

## OCP (Open/Closes Principle)

> "Software entities (classes, modules, functions, etc...) should be open for extension, but closed for modification."

La idea es escribir código de forma que sea posible añadir nuevas funcionalidades pero sin modificar el código existente. Esto previene situaciones en que al cambiar clases base haya que adaptar todas las clases dependientes.

Inicialmente este principio se basaba en el uso de la herencia pero Robert C. Martin y otros autores aprendieron con el tiempo que la herencia crea una fuerte dependencia entre las clases. Es mejor el uso de *_interfaces_* que el uso de la herencia.

El mayor beneficio es que las interfaces introducen una capa extra de abstración que otorga un bajo nivel de acoplamiento. Las implementaciones que hace cada clase de esa interfaz son independientes unas de otras y no necesitan compartir el código.

En el caso de que fuera beneficioso el compartir código sería mejor optar por la herencia o la composición.

En el ejemplo tenemos la clase _EventHandler_ con un método _changeDrivingMode()_ que permite cambiar ciertos parámetros de la clase _Vehicle_ según el modo de conducción. Este modo de conducción se codifica en una enumeración.

![Diagram](https://raw.githubusercontent.com/alxgcrz/design-patterns-java/master/src/solid/ocp/ocp_violation_diagram.png)

```java
class EventHandler {

    enum DrivingMode {
        SPORT, COMFORT
    }

    private Vehicle vehicle;

    public EventHandler(final Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    void changeDrivingMode(final DrivingMode drivingMode) {
        switch (drivingMode) {
            case SPORT:
                vehicle.setPower(500);
                vehicle.setSuspensionHeight(10);
                break;
            case COMFORT:
                vehicle.setPower(400);
                vehicle.setSuspensionHeight(20);
                break;
            default:
                vehicle.setPower(200);
                vehicle.setSuspensionHeight(30);
                break;
            // Cuando necesitemos añadir otro modo (e.g. ECONOMY) 2 classes deberán cambiar 'DrivingMode' and 'EventHandler'.
        }
    }
}
```

```java
class Vehicle {

    private int power;
    private int suspensionHeight;

    int getPower() {
        return power;
    }

    void setPower(final int power) {
        this.power = power;
    }

    int getSuspensionHeight() {
        return suspensionHeight;
    }

    void setSuspensionHeight(final int suspensionHeight) {
        this.suspensionHeight = suspensionHeight;
    }
}
```

El **_Open/Closed Principle_** se incumple ya que si tenemos que añadir un nuevo modo de conducción, deberemos añadir el nuevo modo en la enumeración y deberemos modificar el método _changeDrivingMode()_ para tener en cuenta este nuevo modo.

Para cumplir el **_Open/Closed Principle_** deberemos refactorizar el código de forma que el método _changeDrivingMode(DrivingMode)_ no necesite ser modificado si se añade nueva funcionalidad. Por tanto debe permanecer cerrado a la modificación.

Esto lo conseguimos haciendo uso de las _interfaces_ (en vez del uso de la herencia) de modo que en el método _changeDrivingMode(DrivingMode)_ utilicemos la interfaz _DrivingMode_. Si necesitamos añadir un nuevo modo de conducción únicamente será necesario añadir la nueva clase que herede de la interfaz _DrivingMode_ para que el sistema tenga en cuenta el nuevo modo. El método _changeDrivingMode(DrivingMode)_ permanece inalterado y plenamente funcional ya que este método hace uso de la interfaz y ésta no se ha modificado.

![Diagram](https://raw.githubusercontent.com/alxgcrz/design-patterns-java/master/src/solid/ocp/ocp_solution_diagram.png)

```java
interface DrivingMode {

    int getPower();

    int getSuspensionHeight();
}

class Comfort implements DrivingMode {

    private static final int POWER = 400;
    private static final int SUSPENSION_HEIGHT = 20;

    @Override
    public int getPower() {
        return POWER;
    }

    @Override
    public int getSuspensionHeight() {
        return SUSPENSION_HEIGHT;
    }
}

class Sport implements DrivingMode {

    private static final int POWER = 500;
    private static final int SUSPENSION_HEIGHT = 10;

    @Override
    public int getPower() {
        return POWER;
    }

    @Override
    public int getSuspensionHeight() {
        return SUSPENSION_HEIGHT;
    }
}
```

```java
class EventHandler {

    private Vehicle vehicle;

    public EventHandler(final Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public void changeDrivingMode(final DrivingMode drivingMode) {
        vehicle.setPower(drivingMode.getPower());
        vehicle.setSuspensionHeight(drivingMode.getSuspensionHeight());
        // Ahora, cuando necesitemos añadir otro modo (e.g. ECONOMY) sólo hay que crear la clase 'Economy'.
    }
}
```

## LSP (Liskov Substitution Principle)

El **_Liskov Substitution Principle_** extiendel el **_Open/Closed Principle_** pero focalizando en el comportamiento de una superclase y sus subtipos de forma que si aplicamos este principio en nuestras clases e interfaces estaremos evitando todo tipo de efectos secundarios.

Este principio define que los objetos de una superclase deben ser reemplazables por objetos de sus subclases sin "romper" la aplicación o sistema. Eso requiere que los objetos de las subclases se comporten de la misma manera que los objetos de la superclase.

Para conseguir esto las subclases deberían seguir estas reglas:

* No implementar reglas de validación más estrictas en los parámetros de entrada que las implementadas por la clase base.

* Aplicar al menos las mismas reglas a todos los parámetros de salida aplicados por la clase base.

En el ejemplo tenemos las clases _Cuervo_ y _Avestruz_ que heredan de la clase _Ave_.

![Diagram](https://raw.githubusercontent.com/alxgcrz/design-patterns-java/master/src/solid/lsp/lsp_violation_diagram.png)

```java
class Ave {
    void fly() {}
    void eat() {}
}

class Cuervo extends Ave {}

class Avestruz extends Ave {
    void fly(){
        throw new UnsupportedOperationException();
    }
}

public BirdTest{
  public static void main(String[] args){
        List<Bird> birdList = new ArrayList<Bird>();
        birdList.add(new Bird());
        birdList.add(new Crow());
        birdList.add(new Ostrich());
        letTheBirdsFly ( birdList );
    }
  static void letTheBirdsFly ( List<Bird> birdList ){
        for ( Bird b : birdList ) {
            b.fly();
        }
    }
}
```

Según el **_Liskov Substitution Principle_** deberíamos poder utilizar las clases _Crow_ o _Ostrich_ en lugar de la superclase _Bird_. Debido a que no se cumple este principio no se puede usar de forma indistinta la superclase o las subclases sin generar errores en la aplicación ya que la subclase _Ostrich_ tiene unas restricciones superiores a la superclase en el método _fly()_. Este método lanza una _UnsupportedOperationException_ que no se lanza ni en la otra subclase ni en la superclase. Por tanto no se pueden usar de forma indistinta. Si usamos la subclase _Ostrich_ deberemos captura o relanzar dicha excepción.

Para cumplir con **_Liskov Substitution Principle_** refactorizamos la superclase _Bird_ y creamos las clases _NonFlight_ y _Flight_. Movemos el método _fly()_ a la clase correspondiente y de esta forma podemos usar la subclase y la superclase de forma indistinta.

![Diagram](https://raw.githubusercontent.com/alxgcrz/design-patterns-java/master/src/solid/lsp/lsp_solution_diagram.png)

```java
class Bird {
    void eat() {}
}

public class FlightBird extends Bird {
    void fly() {}
}

public class NonFlight extends Bird {

}
```

## ISP (Interface Segregation Principle)

> Clients should not be forced to depend upon interfaces that they do not use.  
> -- Robert C. Martin

El objetivo de este principio, al igual que el **_Single Responsibility Principle_** es reducir los efectos secundarios y la frecuencia de los cambios si dividimos el código en múltiples partes independientes.

Al seguir este principio se evitan interfaces infladas que definen métodos para múltiples responasiblidades.

En el ejemplo tenemos las subclases _Drone_ y _Car_ que implementan la interfaz _Switches_.

![Diagram](https://raw.githubusercontent.com/alxgcrz/design-patterns-java/master/src/solid/isp/isp_violation_diagram.png)

```java
interface Switches {
    void startEngine();
    void turnRadioOn();
    void turnRadioOff();
    void turnCameraOn();
    void turnCameraOff();
}

class Car implements Switches {
    private boolean radioOn;

    @Override
    public void startEngine() {
        // ...
    }

    @Override
    public void turnRadioOn() { radioOn = true; }

    @Override
    public void turnRadioOff() { radioOn = false;  }

    @Override
    public void turnCameraOn() {
        // nothing to do here
    }

    @Override
    public void turnCameraOff() {
        // nothing to do here
    }
}

class Drone implements Switches {
    private boolean cameraOn;

    @Override
    public void startEngine() {
        // ...
    }

    @Override
    public void turnCameraOn() { cameraOn = true; }

    @Override
    public void turnCameraOff() { cameraOn = false; }

    @Override
    public void turnRadioOn() {
        // nothing to do here
    }

    @Override
    public void turnRadioOff() {
        // nothing to do here
    }
}
```

En este ejemplo las subclases, debido a la herencia, se ven obligadas a implementar con un cuerpo vacío los métodos que no les son necesarios. La subclase _Car_ se ve obligada a implementar los métodos _turnCameraOn()_ y _turnCameraOff()_ que son más propios de la subclase _Dron_ y pasa lo mismo con los métodos _turnRadioOn()_ y _turnRadioOff()_.

Para cumplir con el **_Interface Segregation Principle_** debemos refactorizar el código de forma que en vez de tener una única interfaz con demasiada responsabilidad tengamos tres interfaces con menor responsabilidad.

![Diagram](https://raw.githubusercontent.com/alxgcrz/design-patterns-java/master/src/solid/isp/isp_solution_diagram.png)

```java
interface EngineSwitch {
    void startEngine();
}

interface CameraSwitch extends EngineSwitch {
    void turnCameraOn();
    void turnCameraOff();
}

interface RadioSwitch extends EngineSwitch {
    void turnRadioOn();
    void turnRadioOff();
}

class Car implements RadioSwitch {
    private boolean radioOn;

    @Override
    public void startEngine() {
        // ....
    }

    @Override
    public void turnRadioOn() { radioOn = true; }

    @Override
    public void turnRadioOff() { radioOn = false; }
}

class Drone implements CameraSwitch {
    private boolean cameraOn;

    @Override
    public void startEngine() {
        // ....
    }

    @Override
    public void turnCameraOn() { cameraOn = true; }

    @Override
    public void turnCameraOff() { cameraOn = false; }
}
```

Ahora la subclase _Drone_ implementa la interfaz _CameraSwitch_ y la subclase _Car_ implementa la interfaz _RadioSwitch_. Ambas interfaces heredan de la interfaz común _EngineSwitch_.

## DIP (Dependency Injection Principle)

La idea general de este principio es tan simple como importante: los módulos de alto nivel, que brindan una lógica compleja, deben ser fácilmente reutilizables y no verse afectados por los cambios en los módulos de bajo nivel, que brindan funciones de utilidad.

Para lograr eso, se deben introducir una abstracción que desacople los módulos de alto y bajo nivel entre sí.

La definición de este principio según _Robert C. Martin_ consta de dos partes:

* Los módulos de alto nivel no deben depender de módulos de bajo nivel. Ambos deberían depender de abstracciones.

* Las abstracciones no deben depender de los detalles. Los detalles deben depender de las abstracciones.

Un importante detalle de esta definición es que tanto los módulos de alto nivel como los de bajo nivel dependen de una abstracción. Por tanto no se invierte la dirección de la dependencia como cabría esperar por el nombre del principio sino que se divide la dependencia entre los módulos de alto y bajo nivel introduciendo una abstracción entre ellos.

Si se han aplicado correctamente el **_Open/Closed Principle_** y el **_Liskov Substitution Principle_** también se ha seguido este principio.

El **_Open/Closed Principle_** requiere que el componente esté abierto a extensión pero cerrado a modificación. Se puede lograr introduciendo interfaces para las que puede proporcionar diferentes implementaciones. La interfaz en sí misma está cerrada a modificaciones y puede ampliarse fácilmente proporcionando una nueva implementación de interfaz.

Sus implementaciones deben seguir el **_Liskov Substitution Principle_** para que pueda reemplazarlas con otras implementaciones de la misma interfaz sin "romper" la aplicación o sistema.

En el ejemplo tenemos la clase _Pilot_ que tiene una dependencia con la clase _RacingCar_ ya que en su método constructor se construye una instancia de la clase _RacingCar_.

![Diagram](https://raw.githubusercontent.com/alxgcrz/design-patterns-java/master/src/solid/dip/dip_violation_diagram.png)

```java
class RacingCar {
    private int remainingFuel;
    private int power;

    public RacingCar(final int fuel) {
        remainingFuel = fuel;
    }

    void accelerate() {
        power++;
        remainingFuel--;
    }
}

class Pilot {
    private RacingCar vehicle;

    public Pilot() {
        this.vehicle = new RacingCar(100);
    }

    void increaseSpeed() {
        vehicle.accelerate();
    }
}
```

Para introducir una abstracción que desacople ambas clases creamos la interfaz _Vehicle_ de forma que la clase _Pilot_ en su constructor recibirá un objeto que implemente dicha interfaz. En el ejemplo la clase _RacingCar_ implementa dicha interfaz pero si hemos aplicado correctamente los otros principios podremos utilizar otras implentaciones y ampliar la funcionalidad del sistema sin que se produzcan errores.

![Diagram](https://raw.githubusercontent.com/alxgcrz/design-patterns-java/master/src/solid/dip/dip_solution_diagram.png)

```java
interface Vehicle {
    void accelerate();
}


class RacingCar implements Vehicle {
    private int remainingFuel;
    private int power;

    public RacingCar(final int fuel) {
        remainingFuel = fuel;
    }

    @Override
    public void accelerate() {
        power++;
        remainingFuel--;
    }
}

class Driver {
    private Vehicle vehicle;

    public Driver(final Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public void increaseSpeed() {
        vehicle.accelerate();
    }
}
```

Este principio está relacionado con el concepto de **Inyección de Dependencias** ya que será otro sistema el que _inyecte_ en tiempo de ejecución la implementación que requiera la clase.

---

## License

[![Licencia de Creative Commons](https://i.creativecommons.org/l/by-sa/4.0/80x15.png)](http://creativecommons.org/licenses/by-sa/4.0/)  
Esta obra está bajo una [licencia de Creative Commons Reconocimiento-Compartir Igual 4.0 Internacional](http://creativecommons.org/licenses/by-sa/4.0/).
