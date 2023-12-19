import * as obj from "./ObjectUtil";

describe("ObjectUtil test.", () => {
  test("convertKeysCamelCaseToUnderscore test.", async () => {
    const input = {
      propertyOne: "value1",
      propertyTwo: "value2",
      propertythree: "value3",
      property_four: "value4",
      property_Five: "value5",
    };
    const result = obj.convertKeysCamelCaseToUnderscore(input);
    expect(result.property_one).toBe("value1");
    expect(result.property_two).toBe("value2");
    expect(result.propertythree).toBe("value3");
    expect(result.property_four).toBe("value4");
    // TODO do we want to fix this situation where we are mixing camel case and underscores?
    expect(result.property__five).toBe("value5");
  });

  test("convertAnswersAryToObj with all properties populated.", async () => {
    const input = [
      {
        participantId: 1,
        sessionId: 2,
        treatmentId: 1,
        position: 1,
        data: "data1",
      },
      {
        participantId: 1,
        sessionId: 2,
        treatmentId: 2,
        position: 1,
        data: "data2",
      },
    ];
    const result = obj.convertAnswersAryToObj(input);
    expect(result.participantId).toBe(1);
    expect(result.sessionId).toBe(2);
    expect(result.treatmentId_1_1).toBe(1);
    expect(result.treatmentId_2_1).toBe(2);
    expect(result.data_1_1).toBe("data1");
    expect(result.data_2_1).toBe("data2");
  });

  test("convertAnswersAryToObj with undefined and null properties.", async () => {
    const input = [
      {
        participantId: 1,
        sessionId: 2,
        treatmentId: 1,
        position: 1,
        data: undefined,
      },
      {
        participantId: 1,
        sessionId: 2,
        treatmentId: 2,
        position: 1,
        data: null,
      },
    ];
    const result = obj.convertAnswersAryToObj(input);
    expect(result.participantId).toBe(1);
    expect(result.sessionId).toBe(2);
    expect(result.treatmentId_1_1).toBe(1);
    expect(result.treatmentId_2_1).toBe(2);
    expect(result.data_1_1).toBeUndefined();
    expect(result.data_2_1).toBeNull();
  });

  test("setAllPropertiesEmpty test.", async () => {
    const input = { property1: "value1", property2: "value2" };
    const result = obj.setAllPropertiesEmpty(input);
    expect(result.property1).toBe("");
    expect(result.property2).toBe("");
  });

  test("convertKeysUnderscoreToCamelCase test.", async () => {
    const input = {
      propertyOne: "value1",
      propertyTwo: "value2",
      propertythree: "value3",
      property_four: "value4",
      property_Five: "value5",
      property__six: "value6",
    };
    const result = obj.convertKeysUnderscoreToCamelCase(input);
    expect(result.propertyOne).toBe("value1");
    expect(result.propertyTwo).toBe("value2");
    expect(result.propertythree).toBe("value3");
    expect(result.propertyFour).toBe("value4");
    expect(result.propertyFive).toBe("value5");
    expect(result.propertySix).toBe("value6");
  });
});
